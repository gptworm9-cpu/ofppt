<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\GroupNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherController extends Controller
{

    private function authorizeTeacher(Request $request): ?JsonResponse
    {
        if ($request->user()->role !== 'teacher') {
            return response()->json(['message' => 'Accès réservé aux formateurs.'], 403);
        }

        return null;
    }

    public function students(Request $request): JsonResponse
    {
        if ($response = $this->authorizeTeacher($request)) {
            return $response;
        }

        $request->validate(['group_name' => ['required', 'in:DEV201,DEV202']]);

        $students = User::query()
            ->where('role', 'student')
            ->where('group_name', $request->string('group_name'))
            ->orderBy('last_name')
            ->get();

        return response()->json($students);
    }

    public function saveGrades(Request $request): JsonResponse
    {
        if ($response = $this->authorizeTeacher($request)) {
            return $response;
        }

        $payload = $request->validate([
            'student_id' => ['required', 'exists:users,id'],
            'module_name' => ['required', 'string'],
            'controle_1' => ['nullable', 'numeric', 'between:0,20'],
            'controle_2' => ['nullable', 'numeric', 'between:0,20'],
            'controle_3' => ['nullable', 'numeric', 'between:0,20'],
            'efm' => ['nullable', 'numeric', 'between:0,20'],
            'regional' => ['nullable', 'numeric', 'between:0,20'],
        ]);

        $grade = Grade::updateOrCreate(
            [
                'student_id' => $payload['student_id'],
                'module_name' => $payload['module_name'],
            ],
            [
                ...$payload,
                'teacher_id' => $request->user()->id,
            ]
        );

        return response()->json($grade);
    }

    public function uploadResource(Request $request): JsonResponse
    {
        if ($response = $this->authorizeTeacher($request)) {
            return $response;
        }

        $payload = $request->validate([
            'group_name' => ['required', 'in:DEV201,DEV202'],
            'module_name' => ['required', 'string'],
            'title' => ['required', 'string'],
            'message' => ['nullable', 'string'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png'],
        ]);

        $path = $request->file('file')->store('teacher-resources', 'public');

        $students = User::where('role', 'student')
            ->where('group_name', $payload['group_name'])
            ->get();

        foreach ($students as $student) {
            GroupNotification::create([
                'teacher_id' => $request->user()->id,
                'student_id' => $student->id,
                'group_name' => $payload['group_name'],
                'module_name' => $payload['module_name'],
                'title' => $payload['title'],
                'message' => $payload['message'] ?? '',
                'file_path' => $path,
                'file_type' => $request->file('file')->getClientOriginalExtension(),
            ]);
        }

        return response()->json(['message' => 'Ressource envoyée au groupe.']);
    }
}

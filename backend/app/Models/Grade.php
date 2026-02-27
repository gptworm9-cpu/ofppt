<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'teacher_id',
        'module_name',
        'controle_1',
        'controle_2',
        'controle_3',
        'efm',
        'regional',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'student_id',
        'group_name',
        'module_name',
        'title',
        'message',
        'file_path',
        'file_type',
    ];
}

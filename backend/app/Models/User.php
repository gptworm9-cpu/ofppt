<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'group_name',
        'role',
        'module_name',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id');
    }

    public function notifications()
    {
        return $this->hasMany(GroupNotification::class, 'student_id');
    }
}

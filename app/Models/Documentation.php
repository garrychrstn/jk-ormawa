<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documentation extends Model
{
    protected $fillable = [
    'eventId', 'type', 'doc', 'userId'
    ];
}

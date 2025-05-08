<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    protected $fillable = [
        "title",
        "description",
        "location",
        "poster",
        "registrationStart",
        "registrationEnd",
        "eventStart",
        "eventEnd",
        "ormawaId",
        "createdBy",
        "price",
        "token",
        "active",
        "lpj",
    ];

    public function ormawa()
    {
        return $this->belongsTo(Ormawa::class, "ormawaId");
    }

    public function creator()
    {
        return $this->belongsTo(User::class, "createdBy");
    }

    public function docs()
    {
        return $this->hasMany(Documentation::class, "eventId", "id");
    }
    public function participant()
    {
        return $this->hasMany(Registration::class, "eventId");
    }
    public function feedback()
    {
        return $this->hasMany(Feedback::class, "eventId");
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = "feedbacks";
    protected $fillable = ["feedback", "eventId", "name", "email"];

    public function event()
    {
        return $this->belongsTo(EventController::class, "eventId");
    }
}

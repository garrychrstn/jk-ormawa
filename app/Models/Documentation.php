<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documentation extends Model
{
    protected $fillable = ["eventId", "type", "doc", "userId"];

    public function event()
    {
        return $this->belongsTo(Events::class, "eventId");
    }
}

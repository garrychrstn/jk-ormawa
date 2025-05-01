<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invites extends Model
{
    protected $table = "invites";
    protected $fillable = ["token", "ormawaId", "createdBy", "role"];

    public function ormawa()
    {
        return $this->belongsTo(Ormawa::class, "ormawaId");
    }
}

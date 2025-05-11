<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ormawa extends Model
{
    protected $table = "ormawas";
    protected $fillable = ["name", "description", "logo"];

    public function members()
    {
        return $this->hasMany(User::class, "ormawaId", "id");
    }
    public function events()
    {
        return $this->hasMany(Events::class, "ormawaId");
    }
}

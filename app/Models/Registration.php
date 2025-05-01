
<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        "eventId",
        "userId",
        "isApproved",
        "payment",
        "feedback",
    ];

    public function event()
    {
        return $this->belongsTo(Event::class, "eventId");
    }

    public function user()
    {
        return $this->belongsTo(User::class, "userId");
    }
}

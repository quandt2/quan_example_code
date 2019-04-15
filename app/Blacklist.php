<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Blacklist extends Model
{
    /**
     * @var string
     */
    protected $table = 'blacklist';


    /**
     * @param $ip
     * @return bool
     */
    public static function check($ip)
    {
        if (Blacklist::where('ip', $ip)->first()) {
            return true;
        }else {
            return false;
        }
    }
}

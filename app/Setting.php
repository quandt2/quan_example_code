<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{

    /**
     * @param $key
     * @return mixed
     */
    public static function getSetting($key)
    {
        return Setting::where('key', $key)->value('value');
    }

    /**
     * @param $keys
     * @return object
     */
    public static function getSettings($keys)
    {
        $keys = explode(",", $keys);
        $settings = Setting::whereIn('key', $keys)->get();
        $data = [];
        foreach ($settings as $setting) {
            $data[$setting->key] = $setting->value;
        }
        return (object)$data;
    }
}

<?php

namespace App\Common;

use Illuminate\Http\Request;
use Qcloud\Cos\Client;
use App\Setting;

class MyUpload
{
    /**
    * Storage according to the set storage disk
    */
    static public function uploadFile($file)
    {
        $fileName = md5_file($file).'.'.$file->extension();

        $file_disk = Setting::where('key', 'file_disk')->value('value');
        $file->storeAs('public/images', $fileName);

        return $fileName;
    }
}

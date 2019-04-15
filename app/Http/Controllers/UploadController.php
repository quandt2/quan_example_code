<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Qcloud\Cos\Client;
use App\Setting;

class UploadController extends Controller
{
    /**
    * Storage according to the set storage disk
    */
    static public function uploadFile($file)
    {
        $fileName = md5_file($file).'.'.$file->extension();

        /*$file_disk = Setting::where('key', 'file_disk')->value('value');
        if ($file_disk == 'google_drive') {
            //Use google drive setting

        }else {*/
            //Local storage
        $file->storeAs('public/images', $fileName);
        //}

        return $fileName;
    }
    public function uploadFileApi(Request $request)
    {
        return $this->uploadFile($request->file);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Blacklist;

class BlacklistController extends Controller
{
    public function index()
    {
        $blacks = Blacklist::all();
        return response()->json([
            'blacks' => $blacks
        ]);
    }

    public function store(Request $request)
    {
        $ip = $request->ip;
        $black = Blacklist::where('ip', $ip)->first();
        if ($black) {
            return response()->json([
                'message' => 'The IP is already in the blacklist！'
            ]);
        }else {
            $black = new Blacklist;
            $black->ip = $ip;
            $black->save();
            return response()->json([
                'message' => 'The IP has been blacklisted！'
            ]);
        }
    }

    public function destroy($id)
    {
        $black = Blacklist::findOrFail($id);
        $black->delete();
        return response()->json([
            'message' => 'Successfully deleted！'
        ]);
    }
}

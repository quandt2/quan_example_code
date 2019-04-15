<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Common\MyFunction;
use App\Comment;
use Auth;

class CommentController extends Controller
{
    /**
     * List Comment [API]
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $comments = Comment::orderBy('created_at', 'desc')->paginate($request->pagesize);
        foreach ($comments as $comment) {
            $comment->key = $comment->id;
            $comment->article_name = $comment->article->title;
            $comment->location = '/articles/' . $comment->article_id . '#comment' . $comment->id;
        }
        return $comments;
    }
    /**
     * Delete comment [API]
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json([
            'message' => 'Successfully deleted!'
        ]);
    }
}

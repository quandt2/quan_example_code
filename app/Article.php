<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title', 'cover', 'content_raw', 'content_html', 'is_top', 'is_hidden', 'view', 'comment'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }


    /**
     * @param $id
     */
    static public function update_comment($id)
    {
        $article = Article::findOrFail($id);
        $article->comment = $article->comment + 1;
        $article->update([
            'comment' => $article->comment,
        ]);
    }
}

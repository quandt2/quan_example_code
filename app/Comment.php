<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * @var array
     */
    protected $fillable = [
        'user_id', 'article_id', 'parent_id', 'content', 'name', 'email', 'website', 'avatar', 'ip', 'city'
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function article()
    {
        return $this->belongsTo('App\Article');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function replys()
    {
        return $this->hasMany('App\Comment', 'parent_id');
    }
}

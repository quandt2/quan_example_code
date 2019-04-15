<?php

/**
 * Generate image address based on the storage disk
 *
 */
function imageURL($url)
{
    if (!$url) {
        return;
    }

    $file_disk = App\Setting::where('key', 'file_disk')->value('value');
    return '/storage/images/' . $url;
}

/**
 * get web setting
 *
 */
function setting($key, $default = null)
{
    return App\Setting::getSetting($key) ?: $default;
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>TEST TITLE</title>
</head>
<body>
    <h4>What you posted “{{ $title }}” received a reply：</h4>
    <p> {{ $comment->name }} ：{{ $comment->content }} </p>
    <p><a href="{{ $url }}">Click here to view</a></p>
</body>
</html>

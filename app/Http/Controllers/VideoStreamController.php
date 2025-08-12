<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream($filename)
    {
        $path = storage_path('app/public/videos/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        $fileSize = filesize($path);
        $start = 0;
        $end = $fileSize - 1;

        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            list(, $range) = explode('=', $range, 2);

            if (strpos($range, ',') !== false) {
                return response('Requested Range Not Satisfiable', 416);
            }

            if ($range == '-') {
                $start = $fileSize - substr($range, 1);
            } else {
                $range = explode('-', $range);
                $start = $range[0];
                $end = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $fileSize - 1;
            }

            $start = intval($start);
            $end = intval($end);

            if ($start > $end || $start > $fileSize - 1 || $end >= $fileSize) {
                return response('Requested Range Not Satisfiable', 416);
            }
        }

        $length = $end - $start + 1;

        return response()->stream(function () use ($path, $start, $length) {
            $stream = fopen($path, 'rb');
            fseek($stream, $start);

            $buffer = 8192;
            $read = 0;

            while (!feof($stream) && $read < $length) {
                $toRead = min($buffer, $length - $read);
                echo fread($stream, $toRead);
                $read += $toRead;
                flush();
            }

            fclose($stream);
        }, isset($_SERVER['HTTP_RANGE']) ? 206 : 200, [
            'Content-Type' => 'video/mp4',
            'Content-Length' => $length,
            'Accept-Ranges' => 'bytes',
            'Content-Range' => "bytes $start-$end/$fileSize",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}

<?php

namespace App\Repositories;

use App\Models\Resource;

class VideoRepository
{
    protected $model;

    public function __construct(Resource $model)
    {
        $this->model = $model;
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function getMaxOrderByLesson($lessonId)
    {
        return $this->model->where('lesson_id', $lessonId)
            ->where('type', 'video')
            ->max('order') ?? 0;
    }

    public function findByLessonId($lessonId)
    {
        return $this->model->where('lesson_id', $lessonId)
            ->where('type', 'video')
            ->orderBy('order')
            ->get();
    }

    public function findById($id)
    {
        return $this->model->where('type', 'video')->findOrFail($id);
    }

    public function delete($id)
    {
        return $this->model->where('type', 'video')->findOrFail($id)->delete();
    }
}

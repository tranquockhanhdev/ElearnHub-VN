<?php

namespace App\Repositories;

use App\Models\Resource;

class DocumentRepository
{
    protected $model;

    public function __construct(Resource $model)
    {
        $this->model = $model;
    }

    public function model()
    {
        return $this->model;
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function getMaxOrderByLessonAndType($lessonId, $type = 'document')
    {
        return $this->model->where('lesson_id', $lessonId)
            ->where('type', $type)
            ->max('order') ?? 0;
    }

    public function findByLessonId($lessonId)
    {
        return $this->model->where('lesson_id', $lessonId)
            ->where('type', 'document')
            ->orderBy('order')
            ->get();
    }

    public function findById($id)
    {
        return $this->model->where('type', 'document')->findOrFail($id);
    }

    public function delete($id)
    {
        return $this->model->where('type', 'document')->findOrFail($id)->delete();
    }
}

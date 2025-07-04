<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    protected $homeService;

    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    public function index()
    {
        $homeData = $this->homeService->getHomePageData();

        return Inertia::render('Public/Index', $homeData);
    }

    public function about()
    {
        return Inertia::render('Public/About');
    }
    public function terms()
    {
        return Inertia::render('Public/Terms');
    }
    public function seb()
    {
        return Inertia::render('Errors/SEBRequired');
    }
}

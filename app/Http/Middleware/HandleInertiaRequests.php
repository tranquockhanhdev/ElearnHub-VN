<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\WebsiteSetting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role_id,
                ] : null,
                'instructor' => $request->user() && $request->user()->role_id == 2 ?
                    \App\Models\Instructor::where('user_id', $request->user()->id)->first() : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'setting' => $this->getWebsiteSettings(),
        ]);
    }

    /**
     * Get website settings with caching for better performance
     *
     * @return array
     */
    private function getWebsiteSettings(): array
    {
        $settings = WebsiteSetting::first();

        if (!$settings) {
            // Return default values if no settings exist
            return [
                'site_name' => config('app.name', 'EHub'),
                'contact_email' => null,
                'site_logo_url' => null,
                'homepage_banner' => null,
                'footer_text' => null,
                'facebook_url' => null,
                'support_phone' => null,
                'maintenance_mode' => false,
            ];
        }

        return [
            'site_name' => $settings->site_name,
            'contact_email' => $settings->contact_email,
            'site_logo_url' => $settings->site_logo_url,
            'homepage_banner' => $settings->homepage_banner,
            'footer_text' => $settings->footer_text,
            'facebook_url' => $settings->facebook_url,
            'support_phone' => $settings->support_phone,
            'maintenance_mode' => (bool) $settings->maintenance_mode,
        ];
    }
}

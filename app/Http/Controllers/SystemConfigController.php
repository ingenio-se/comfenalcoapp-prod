<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemConfigController extends Controller
{
    public function getCieVersion()
    {
        // Retrieve the configuration record from the system_config table using DB
        $config = DB::table('system_config')
                    ->where('config_key', 'cie_version')
                    ->first();

        if ($config) {
            return response()->json(['version' => $config->config_value]);
        }

        return response()->json(['error' => 'Configuration not found'], 404);
    }
    
    public function updateCieVersion(Request $request)
    {
        $version = $request->input('version');
        
        DB::table('system_config')
            ->where('config_key', 'cie_version')
            ->update([
                'config_value' => $version,
                'updated_at'   => now()
            ]);

        return response()->json(['message' => 'CIE version updated successfully'], 200);
    }
}
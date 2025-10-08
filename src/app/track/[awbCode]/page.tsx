'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface TrackingData {
  tracking_data: {
    track_status: number;
    shipment_status: number;
    shipment_track: Array<{
      id: number;
      awb_code: string;
      courier_company_id: number;
      shipment_id: number;
      order_id: number;
      pickup_date: string;
      delivered_date?: string;
      weight: string;
      packages: number;
      current_status: string;
      delivered_to?: string;
      destination: string;
      consignee_name: string;
      origin: string;
      courier_agent_details?: any;
      courier_name: string;
      edd?: string;
      pod?: string;
      pod_status?: string;
    }>;
    shipment_track_activities: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
      "sr-status": string;
      "sr-status-label": string;
    }>;
    track_url: string;
    etd: string;
    qc_response: {
      qc_image: string;
      qc_failed_reason: string;
    };
  };
}

export default function TrackPage() {
  const params = useParams();
  const awbCode = params.awbCode as string;
  
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (awbCode) {
      fetchTrackingData();
    }
  }, [awbCode]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/shiprocket/track?awbCode=${awbCode}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch tracking data');
      }
      
      const data = await res.json();
      setTrackingData(data.tracking);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in transit': return 'bg-yellow-100 text-yellow-800';
      case 'out for delivery': return 'bg-purple-100 text-purple-800';
      case 'picked up': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tracking Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTrackingData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📦</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Tracking Data</h1>
          <p className="text-gray-600">Unable to find tracking information for this AWB code.</p>
        </div>
      </div>
    );
  }

  const shipment = trackingData.tracking_data.shipment_track[0];
  const activities = trackingData.tracking_data.shipment_track_activities;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Package Tracking</h1>
              <p className="text-gray-600">AWB Code: {awbCode}</p>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment?.current_status || 'Unknown')}`}>
                {shipment?.current_status || 'Unknown'}
              </div>
              {shipment?.courier_name && (
                <p className="text-sm text-gray-600 mt-1">via {shipment.courier_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        {shipment && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Origin</p>
                <p className="font-medium">{shipment.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-medium">{shipment.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-medium">{shipment.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Packages</p>
                <p className="font-medium">{shipment.packages}</p>
              </div>
              {shipment.pickup_date && (
                <div>
                  <p className="text-sm text-gray-600">Pickup Date</p>
                  <p className="font-medium">{new Date(shipment.pickup_date).toLocaleString()}</p>
                </div>
              )}
              {shipment.delivered_date && (
                <div>
                  <p className="text-sm text-gray-600">Delivered Date</p>
                  <p className="font-medium">{new Date(shipment.delivered_date).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tracking Activities */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  {index < activities.length - 1 && (
                    <div className="w-px h-8 bg-gray-300 ml-1.5"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(activity["sr-status-label"])}`}>
                    {activity["sr-status-label"]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Tracking Link */}
        {trackingData.tracking_data.track_url && (
          <div className="mt-6 text-center">
            <a
              href={trackingData.tracking_data.track_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track on Shiprocket
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}



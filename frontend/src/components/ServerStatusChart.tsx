import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wifi, WifiOff } from 'lucide-react';

interface ServerStatusData {
  id: number;
  status: string;
  responseTime: number;
  timestamp: string;
}

export default function ServerStatusChart() {
  const [data, setData] = useState<ServerStatusData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetchData();

    const ws = new WebSocket('wss://api.bimerz.ir/ws/');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'server_status_update') {
        setData(prevData => {
          const newData = [...prevData, message.data];
          // Keep only last 50 data points for performance
          return newData.slice(-50);
        });
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.bimerz.ir/server-status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching server status data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (rawData: ServerStatusData[]) => {
    return rawData.map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      responseTime: Number(item.responseTime)
    }));
  };

  const chartData = formatData(data);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">وضعیت سرور</h3>
          <p className="text-sm text-gray-600">نمودار زمان پاسخ و وضعیت سرور</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">آنلاین</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm">آفلاین</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              fontSize={12}
              tick={{ fontSize: 10 }}
              label={{ value: 'زمان پاسخ (ms)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              labelFormatter={(label: string) => `زمان: ${label}`}
              formatter={(value: number) => [
                `${value} ms`,
                'زمان پاسخ'
              ]}
            />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ fill: '#0d9488', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#0d9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(data.reduce((sum, item) => sum + item.responseTime, 0) / data.length)}ms
            </div>
            <div className="text-sm text-gray-600">میانگین زمان پاسخ</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.min(...data.map(item => item.responseTime))}ms
            </div>
            <div className="text-sm text-gray-600">کمترین زمان پاسخ</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {Math.max(...data.map(item => item.responseTime))}ms
            </div>
            <div className="text-sm text-gray-600">بیشترین زمان پاسخ</div>
          </div>
        </div>
      )}
    </div>
  );
}
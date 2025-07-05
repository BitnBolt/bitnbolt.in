'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
];

interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface ProfileData {
    phoneNumber: string;
    deliveryAddress: DeliveryAddress;
    emailVerified: boolean;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [editMode, setEditMode] = useState({
        phone: false,
        address: false
    });
    console.log(session);
    const [profileData, setProfileData] = useState<ProfileData>({
        phoneNumber: '',
        deliveryAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        },
        emailVerified: false
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated') {
            fetchProfileData();
            // Check for verification success message
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('verified') === 'true') {
                setMessage({ type: 'success', content: 'Email verified successfully!' });
                // Remove the query parameter
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [status, router]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/user/profile');
            if (response.ok) {
                const data = await response.json();
                setProfileData({
                    phoneNumber: data.phoneNumber || '',
                    deliveryAddress: {
                        street: data.deliveryAddress?.street || '',
                        city: data.deliveryAddress?.city || '',
                        state: data.deliveryAddress?.state || '',
                        postalCode: data.deliveryAddress?.postalCode || '',
                        country: data.deliveryAddress?.country || ''
                    },
                    emailVerified: data.emailVerified
                });
            }
        } catch {
            setMessage({ type: 'error', content: 'Failed to load profile data' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (section: 'phone' | 'address') => {
        setIsSaving(true);
        setMessage({ type: '', content: '' });

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                setMessage({ type: 'success', content: 'Profile updated successfully!' });
                setEditMode({ ...editMode, [section]: false });
            } else {
                const data = await response.json();
                setMessage({ type: 'error', content: data.error || 'Failed to update profile' });
            }
        } catch {
            setMessage({ type: 'error', content: 'An error occurred while saving' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                deliveryAddress: {
                    ...prev.deliveryAddress,
                    [addressField]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <main className="min-h-screen">
                <Header />
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Header />
            
            {/* Hero Section */}
            {/* <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Your <span className="text-blue-600">Profile</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Manage your personal information and delivery preferences
                        </p>
                    </div>
                </div>
            </section> */}

            <section className="py-12 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="border-b border-gray-200 bg-gray-50 px-8 py-8">
                            <div className="flex items-center space-x-6">
                                {session?.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || ''}
                                        width={72}
                                        height={72}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-[72px] h-[72px] bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                                        {session?.user?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{session?.user?.name}</h2>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-gray-600">{session?.user?.email}</p>
                                        {session?.user?.email && (
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${profileData.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {profileData.emailVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        )}
                                    </div>
                                    {!profileData.emailVerified && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    setMessage({ type: '', content: '' });
                                                    const response = await fetch('/api/auth/verify-email/send', {
                                                        method: 'POST'
                                                    });
                                                    const data = await response.json();
                                                    if (response.ok) {
                                                        setMessage({ type: 'success', content: 'Verification email sent! Please check your inbox.' });
                                                    } else {
                                                        setMessage({ type: 'error', content: data.error || 'Failed to send verification email' });
                                                    }
                                                } catch {
                                                    setMessage({ type: 'error', content: 'An error occurred while sending verification email' });
                                                }
                                            }}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                                        >
                                            Resend Verification Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        {message.content && (
                            <div className={`mx-8 mt-8 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                {message.content}
                            </div>
                        )}

                        {/* Phone Number Section */}
                        <div className="p-8 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Phone Number</h3>
                                {!editMode.phone && (
                                    <button
                                        onClick={() => setEditMode({ ...editMode, phone: true })}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {editMode.phone ? (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setEditMode({ ...editMode, phone: false })}
                                            className="text-gray-600 hover:text-gray-800 font-medium px-6 py-2.5 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSubmit('phone')}
                                            disabled={isSaving}
                                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 text-lg">
                                    {profileData.phoneNumber || 'No phone number added'}
                                </p>
                            )}
                        </div>

                        {/* Address Section */}
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                                {!editMode.address && (
                                    <button
                                        onClick={() => setEditMode({ ...editMode, address: true })}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {editMode.address ? (
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address.street"
                                            name="address.street"
                                            value={profileData.deliveryAddress.street}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="address.city"
                                                name="address.city"
                                                value={profileData.deliveryAddress.city}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <select
                                                id="address.state"
                                                name="address.state"
                                                value={profileData.deliveryAddress.state}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base bg-white"
                                            >
                                                <option value="">Select a state</option>
                                                {INDIAN_STATES.map((state) => (
                                                    <option key={state} value={state}>
                                                        {state}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                id="address.postalCode"
                                                name="address.postalCode"
                                                value={profileData.deliveryAddress.postalCode}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                id="address.country"
                                                name="address.country"
                                                value={profileData.deliveryAddress.country}
                                                onChange={handleChange}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-6">
                                        <button
                                            onClick={() => setEditMode({ ...editMode, address: false })}
                                            className="text-gray-600 hover:text-gray-800 font-medium px-6 py-2.5 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSubmit('address')}
                                            disabled={isSaving}
                                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-gray-600 text-lg">
                                    {profileData.deliveryAddress.street ? (
                                        <>
                                            <p>{profileData.deliveryAddress.street}</p>
                                            <p>
                                                {profileData.deliveryAddress.city}, {profileData.deliveryAddress.state} {profileData.deliveryAddress.postalCode}
                                            </p>
                                            <p>{profileData.deliveryAddress.country}</p>
                                        </>
                                    ) : (
                                        <p>No address added</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Explore More?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Continue shopping for the latest IoT solutions or check your order status
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => router.push('/orders')}
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            View Your Orders
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
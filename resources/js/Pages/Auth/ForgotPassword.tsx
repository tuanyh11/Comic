import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { FormEventHandler } from 'react';
import AuthButton from './Partials/AuthButton';
import AuthInput from './Partials/AuthInput';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <AuthInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    icon={<Mail className="h-5 w-5 text-blue-400" />}
                    error={errors.email}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <div className="mt-4 flex items-center justify-end">
                    <AuthButton className="ms-4" processing={processing}>
                        Email Password Reset Link
                    </AuthButton>
                </div>
            </form>
        </GuestLayout>
    );
}

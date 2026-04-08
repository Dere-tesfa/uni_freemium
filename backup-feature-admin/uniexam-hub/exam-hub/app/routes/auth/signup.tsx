import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '../../lib/zod-schemas';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Link, useFetcher, useNavigate } from 'react-router';
import type { Route } from './+types/signup';
import { useEffect } from 'react';

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Server-side validation with Zod
    const result = signupSchema.safeParse({ fullName, email, phone, password, confirmPassword });

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    // Simulate API call
    console.log('Signing up with:', result.data);

    // In a real app, you'd create the user here
    // and set a session cookie.

    return { success: true };
}

export default function Signup() {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const isSubmitting = fetcher.state === 'submitting';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    useEffect(() => {
        if (fetcher.data?.success) {
            navigate('/auth/login');
        }
    }, [fetcher.data, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
            <div className="w-full max-w-md p-8 border bg-card rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold mb-2 text-primary">Create Account</h1>
                <p className="text-muted-foreground mb-8 text-sm">
                    Join thousands of students and start mastering your exams.
                </p>

                <fetcher.Form
                    method="post"
                    className="space-y-4"
                    onSubmit={handleSubmit((data) => {
                        const formData = new FormData();
                        formData.append('fullName', data.fullName);
                        formData.append('email', data.email);
                        formData.append('phone', data.phone);
                        formData.append('password', data.password);
                        formData.append('confirmPassword', data.confirmPassword);
                        fetcher.submit(formData, { method: 'post' });
                    })}
                >
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            type="text"
                            placeholder="Sarah Ahmed"
                            {...register('fullName')}
                            className={errors.fullName ? 'border-destructive' : ''}
                        />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input
                            type="tel"
                            placeholder="+251912345678"
                            {...register('phone')}
                            className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                            type="email"
                            placeholder="name@university.edu"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className={errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {fetcher.data?.errors && (
                        <p className="text-sm text-destructive font-medium bg-destructive/10 p-2 rounded">
                            Please fix the errors above and try again.
                        </p>
                    )}

                    <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </fetcher.Form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

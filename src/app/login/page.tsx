import AuthForm from "../../components/AuthForm";


export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8">Netflix</h1>
            <AuthForm isSignup={false} />
        </div>
    );
}
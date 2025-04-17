"use client";



const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-4 text-center">
            <div className="container mx-auto text-center"> 
            <p>&copy; {new Date().getFullYear()} Netfish. All rights reserved.</p>
            <div className="mt-4">
                <a href="/privacy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
                <a href="/contact" className="text-gray-400 hover:text-white mx-2">Contact Us</a>
                <a href="/help" className="text-gray-400 hover:text-white mx-2">Help</a>
                <a href="/about" className="text-gray-400 hover:text-white mx-2">About Us</a>
            </div>
            </div>
        </footer>
    )
}

export default Footer;
// This is a simple footer component for a Netflix-like application. It includes links to privacy policy, terms of service, contact us, help, and about us pages. The footer is styled with Tailwind CSS classes for a responsive design.
import { useNavigate } from "react-router-dom";
import { ShimmerButton } from "../ui/shimmerbutton";


export const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-black text-white min-h-screen w-full flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row max-w-5xl w-full gap-8">
                {/* Chess board image on the left */}
                <div className="md:w-1/2">
                    <img 
                        src="/chess.jpg" 
                        alt="Chess Board" 
                        className="w-full rounded-md"
                    />
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-8">
                        Play Chess Online 
                    </h1>
                    <div className="space-y-4">
                        <ShimmerButton 
                            onClick={() => navigate('/game')}
                            className="w-full"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500 rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">Play Online</p>
                                </div>
                            </div>
                        </ShimmerButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
import Link from 'next/link';

interface StaticPageHeaderProps {
    title: string;
    image: string;
    parent?: { label: string; href: string };
    current: string;
}

export default function StaticPageHeader({ title, image, parent, current }: StaticPageHeaderProps) {
    return (
        <div className="relative h-[400px] w-full bg-gray-900">
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    {parent && (
                        <>
                            <Link href={parent.href} className="hover:text-white transition-colors">{parent.label}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-white">{current}</span>
                </div>
            </div>
        </div>
    );
}

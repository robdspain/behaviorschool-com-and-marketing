import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImageProps {
  priority?: boolean;
  quality?: number;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 90,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      className={cn(
        "transition-opacity duration-200 ease-in-out",
        "max-w-full h-auto",
        className
      )}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        imageRendering: 'auto',
        objectFit: 'cover',
        objectPosition: 'center',
      }}
      {...props}
    />
  );
}

export default OptimizedImage;
const Banner = () => {
  return (
    <div className="aspect-[21/6] bg-black/20 backdrop-blur-sm">
        <video
          className="w-full h-full object-cover"
          src="/videos/banner.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
    </div>
  )
}

export default Banner;
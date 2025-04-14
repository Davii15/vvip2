// Types for our data
export interface VideoPreview {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    videoUrl: string // Placeholder for future embedding
    duration: string
    category: string
  }
  
  export interface LiveStream {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    streamUrl: string // Placeholder for future embedding
    startTime: string
    category: string
    viewers: number
    featured: boolean
  }
  
  export interface PreviousShow {
    id: string
    title: string
    description: string
    thumbnailUrl: string
    videoUrl: string // Placeholder for future embedding
    duration: string
    category: string
    views: number
    uploadDate: string
  }
  
  // Mock data for featured video previews
  export const featuredVideos: VideoPreview[] = [
    {
      id: "1",
      title: "The Grand Concert",
      description: "Experience the magic of live music with our grand orchestra performance.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview1.mp4", // Placeholder
      duration: "0:30",
      category: "Music",
    },
    {
      id: "2",
      title: "Comedy Night Special",
      description: "Laugh out loud with our top comedians in this special preview.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview2.mp4", // Placeholder
      duration: "0:45",
      category: "Comedy",
    },
    {
      id: "3",
      title: "Dance Extravaganza",
      description: "A spectacular showcase of contemporary and classical dance forms.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview3.mp4", // Placeholder
      duration: "0:35",
      category: "Dance",
    },
    {
      id: "4",
      title: "Theater Production: Hamlet",
      description: "A modern take on Shakespeare's classic tragedy.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview4.mp4", // Placeholder
      duration: "0:40",
      category: "Theater",
    },
    {
      id: "5",
      title: "Magic Show Highlights",
      description: "Prepare to be amazed by our world-class illusionists.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview5.mp4", // Placeholder
      duration: "0:50",
      category: "Magic",
    },
    {
      id: "6",
      title: "Cultural Festival",
      description: "A celebration of diverse cultures through music, dance, and art.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/preview6.mp4", // Placeholder
      duration: "0:55",
      category: "Culture",
    },
  ]
  
  // Mock data for live streams
  export const liveStreams: LiveStream[] = [
    {
      id: "1",
      title: "Jazz Night Live",
      description: "Live jazz performance from the Downtown Jazz Club featuring the renowned Jazz Quartet.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live1.m3u8", // Placeholder
      startTime: "19:00",
      category: "Music",
      viewers: 1245,
      featured: true,
    },
    {
      id: "2",
      title: "Stand-up Comedy Hour",
      description: "Live comedy show featuring top comedians from around the country.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live2.m3u8", // Placeholder
      startTime: "20:30",
      category: "Comedy",
      viewers: 876,
      featured: true,
    },
    {
      id: "3",
      title: "Ballet Performance: Swan Lake",
      description: "Live ballet performance of the classic Swan Lake by the National Ballet Company.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live3.m3u8", // Placeholder
      startTime: "18:00",
      category: "Dance",
      viewers: 2134,
      featured: false,
    },
    {
      id: "4",
      title: "Opera: La Traviata",
      description: "Live streaming of Verdi's masterpiece performed by the Metropolitan Opera.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live4.m3u8", // Placeholder
      startTime: "19:30",
      category: "Opera",
      viewers: 1567,
      featured: false,
    },
    {
      id: "5",
      title: "Rock Concert: The Amplifiers",
      description: "Live rock concert featuring The Amplifiers on their world tour.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live5.m3u8", // Placeholder
      startTime: "21:00",
      category: "Music",
      viewers: 3421,
      featured: true,
    },
    {
      id: "6",
      title: "Theater: A Midsummer Night's Dream",
      description: "Live theater performance of Shakespeare's beloved comedy.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      streamUrl: "/streams/live6.m3u8", // Placeholder
      startTime: "18:30",
      category: "Theater",
      viewers: 987,
      featured: false,
    },
  ]
  
  // Mock data for previous shows
  export const previousShows: PreviousShow[] = [
    {
      id: "1",
      title: "Classical Music Concert",
      description: "A beautiful evening of classical music featuring Mozart and Beethoven.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous1.mp4", // Placeholder
      duration: "1:45:30",
      category: "Music",
      views: 12453,
      uploadDate: "2023-11-15",
    },
    {
      id: "2",
      title: "Comedy Festival Highlights",
      description: "The best moments from our annual comedy festival featuring international comedians.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous2.mp4", // Placeholder
      duration: "1:20:15",
      category: "Comedy",
      views: 8765,
      uploadDate: "2023-11-10",
    },
    {
      id: "3",
      title: "Contemporary Dance Show",
      description: "A modern dance performance exploring themes of nature and technology.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous3.mp4", // Placeholder
      duration: "1:30:00",
      category: "Dance",
      views: 6543,
      uploadDate: "2023-11-05",
    },
    {
      id: "4",
      title: "Magic and Illusion Spectacular",
      description: "A mind-bending show of magic, illusion, and the impossible made possible.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous4.mp4", // Placeholder
      duration: "1:15:45",
      category: "Magic",
      views: 9876,
      uploadDate: "2023-10-28",
    },
    {
      id: "5",
      title: "Jazz Festival",
      description: "A celebration of jazz music featuring both established and emerging artists.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous5.mp4", // Placeholder
      duration: "2:30:00",
      category: "Music",
      views: 15678,
      uploadDate: "2023-10-20",
    },
    {
      id: "6",
      title: "Theatrical Performance: Romeo and Juliet",
      description: "A modern interpretation of Shakespeare's tragic love story.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous6.mp4", // Placeholder
      duration: "2:15:30",
      category: "Theater",
      views: 7654,
      uploadDate: "2023-10-15",
    },
    {
      id: "7",
      title: "Cultural Dance Showcase",
      description: "A vibrant showcase of traditional dances from around the world.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous7.mp4", // Placeholder
      duration: "1:45:00",
      category: "Dance",
      views: 8765,
      uploadDate: "2023-10-08",
    },
    {
      id: "8",
      title: "Stand-up Comedy Night",
      description: "An evening of laughter with five of the country's top comedians.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/videos/previous8.mp4", // Placeholder
      duration: "1:30:45",
      category: "Comedy",
      views: 12345,
      uploadDate: "2023-10-01",
    },
  ]
  
  // Function to get more previous shows (for infinity scrolling)
  export async function getMorePreviousShows(page: number): Promise<PreviousShow[]> {
    // In a real application, this would be an API call
    // For now, we'll just return more mock data
    return [
      {
        id: `${8 + page * 8 + 1}`,
        title: `Opera Performance ${page}`,
        description: "A stunning performance of a classic opera with world-renowned singers.",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: `/videos/more${page}1.mp4`, // Placeholder
        duration: "2:30:00",
        category: "Opera",
        views: 7890 + Math.floor(Math.random() * 1000),
        uploadDate: "2023-09-25",
      },
      {
        id: `${8 + page * 8 + 2}`,
        title: `Rock Concert ${page}`,
        description: "An electrifying rock concert that had the audience on their feet.",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: `/videos/more${page}2.mp4`, // Placeholder
        duration: "1:45:30",
        category: "Music",
        views: 15678 + Math.floor(Math.random() * 1000),
        uploadDate: "2023-09-18",
      },
      {
        id: `${8 + page * 8 + 3}`,
        title: `Ballet Performance ${page}`,
        description: "A graceful ballet performance showcasing technical excellence and artistry.",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: `/videos/more${page}3.mp4`, // Placeholder
        duration: "1:50:15",
        category: "Dance",
        views: 6543 + Math.floor(Math.random() * 1000),
        uploadDate: "2023-09-10",
      },
      {
        id: `${8 + page * 8 + 4}`,
        title: `Comedy Special ${page}`,
        description: "A hilarious comedy special that will have you laughing from start to finish.",
        thumbnailUrl: "/placeholder.svg?height=720&width=1280",
        videoUrl: `/videos/more${page}4.mp4`, // Placeholder
        duration: "1:15:00",
        category: "Comedy",
        views: 9876 + Math.floor(Math.random() * 1000),
        uploadDate: "2023-09-05",
      },
    ]
  }
  
  
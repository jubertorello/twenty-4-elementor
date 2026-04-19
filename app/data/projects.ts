export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  img: string;
  year: string;
  videoUrl: string;
  isVideoEmbed: boolean;
  caseStudyImages?: string[];
  details?: {
    challenge: string;
    solution: string;
    result: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'baro',
    title: 'BARO',
    category: 'Netflix Documentation',
    description: 'The story of a man who changed German rap forever. A deep dive into the life and legacy of an icon.',
    img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654026590_17956035957117098_5856671028597925931_n_unocse.jpg',
    year: '2024',
    videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1102574741/rendition/2160p/file.mp4?loc=external&log_user=0&signature=cbfdb8d1762b90739e851c2faca190fb0dea5c608d86e3e24e0261f36fa7332e',
    isVideoEmbed: false,
    caseStudyImages: [
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654026590_17956035957117098_5856671028597925931_n_unocse.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939249/531600444_17921122038117098_5360922844406571590_n_xyddjc.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/653060378_17956036014117098_6147440382387293_n_vqfcrn.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654031290_17956035993117098_4433731200775056854_n_rp4pvn.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774860454/654596267_17956035960117098_3415009189650686711_n_v0xekc.jpg'
    ],
    details: {
      challenge: "Capturing the essence of a cultural icon while maintaining an authentic narrative that resonates with both old-school fans and a new generation.",
      solution: "A multi-layered documentary approach combining archival footage, intimate interviews, and cinematic reconstructions of key moments in German rap history.",
      result: "A top-rated Netflix documentary that set a new standard for music storytelling in Europe."
    }
  },
  {
    slug: 'youtube-festival',
    title: 'YouTube Festival',
    category: 'Event Production',
    description: 'Together with Google, we explored how generative AI is reshaping brand storytelling at the YouTube Festival 2024.',
    img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939096/479487334_17895797886117098_1135703105300039762_n_m9g8ha.jpg',
    year: '2024',
    videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1109107424/rendition/1080p/file.mp4?loc=external&log_user=0&signature=d14d2b21294c474b4a376647b638c254d4f99ea2a56e8e1b747746d512808c6d',
    isVideoEmbed: false,
    caseStudyImages: [
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939096/479487334_17895797886117098_1135703105300039762_n_m9g8ha.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/653060378_17956036014117098_6147440382387293_n_vqfcrn.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654031290_17956035993117098_4433731200775056854_n_rp4pvn.jpg'
    ],
    details: {
      challenge: "Demonstrating the power of AI in a way that felt human and creative, rather than technical and cold.",
      solution: "We produced a series of AI-enhanced visual stories that played live during the keynote, showcasing real-time creative collaboration between humans and machines.",
      result: "High engagement from brand partners and a viral buzz around the future of AI-driven marketing."
    }
  },
  {
    slug: 'openai-germany',
    title: 'OpenAI in Germany',
    category: 'Tech Showcase',
    description: 'OpenAI\'s arrival in Germany became a space for artistic exploration with two immersive pieces produced by TWENTY4.',
    img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774795013/525533485_17919021303117098_6405116482587988328_n_pz9zch.jpg',
    year: '2023',
    videoUrl: 'https://talentfinder.cloud/embed/7hma475c3nrk?autoplay=yes&loop=yes&kiosk=yes&fill=yes',
    isVideoEmbed: true,
    caseStudyImages: [
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774795013/525533485_17919021303117098_6405116482587988328_n_pz9zch.jpg',
      'https://res.cloudinary.com/djqtkbyez/image/upload/v1774860454/654596267_17956035960117098_3415009189650686711_n_v0xekc.jpg'
    ],
    details: {
      challenge: "Creating a physical experience for a purely digital product (AI models).",
      solution: "Two immersive art installations that translated real-time AI processing into light and sound, allowing visitors to 'feel' the computation.",
      result: "A landmark event that established OpenAI's presence in the European creative community."
    }
  },
  {
    slug: 'sundance-2024',
    title: 'Sundance 2024',
    category: 'Film Festival',
    description: 'The rise, the trends, and what\'s next for indie cinema. A cinematic journey through the world\'s premier film festival.',
    img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/475271473_17893917237117098_3840431804277799553_n_gewozi.jpg',
    year: '2024',
    videoUrl: 'https://talentfinder.cloud/embed/d8ay25a4mwdd?autoplay=yes&loop=yes&kiosk=yes&fill=yes',
    isVideoEmbed: true,
    details: {
      challenge: "Capturing the fast-paced energy of Sundance while maintaining a high-end cinematic look.",
      solution: "A small, agile production team using high-speed cameras and real-time editing workflows to deliver daily cinematic dispatches.",
      result: "Over 1M views across social platforms and increased visibility for the featured indie filmmakers."
    }
  },
  {
    slug: 'vattenfall-solar',
    title: 'Vattenfall Solar',
    category: 'Documentary',
    description: 'How can an energy company credibly position itself as a pioneer of a fossil-free future? Telling real stories.',
    img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774174/655199745_17956930731117098_1449537988951363301_n_e4xbis.jpg',
    year: '2023',
    videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1102574741/rendition/2160p/file.mp4?loc=external&log_user=0&signature=cbfdb8d1762b90739e851c2faca190fb0dea5c608d86e3e24e0261f36fa7332e',
    isVideoEmbed: false,
    details: {
      challenge: "Making renewable energy feel personal and emotional rather than industrial.",
      solution: "Focusing on the individuals behind the solar revolution—the engineers, the dreamers, and the communities being transformed.",
      result: "A powerful brand documentary that significantly improved Vattenfall's sustainability perception scores."
    }
  }
];

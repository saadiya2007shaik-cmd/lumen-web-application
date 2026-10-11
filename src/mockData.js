export const mockCreators = [
  {
    id: 1, name: "Aarav Mehta", handle: "aarav.ai",
    avatar_url: "https://i.pravatar.cc/200?img=12",
    bio: "AI filmmaker specializing in hyper-realistic commercials.",
    rating: 4.9, location: "Mumbai, IN",
    skills: ["Prompt Engineering", "Custom LoRA Training", "Video Interpolation"],
    specialization: ["Hyper-Realistic Commercials"],
    styles: ["Photorealistic", "Cyberpunk", "Cinematic"],
    tools: ["Midjourney", "Runway", "ComfyUI"],
    verified_tools: true, verified_workflow: true,
    verified_tools_list: ["Midjourney", "Runway", "ComfyUI"],
    identity_verified: true,
    portfolio: [
      {
        id: 101, title: "Futuristic Sneaker Campaign",
        media_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
        aspect_ratio: "9:16",
        base_models: ["Flux.1 Dev", "Runway Gen-3"],
        loras_used: ["SneakerStyle_v2", "NeonGradient_v1"],
        prompt_string: "cinematic sneaker floating in neon void, 9:16, hyper-detailed, volumetric light, shot on 85mm, cyberpunk palette --ar 9:16 --v 6",
        workflow_description: "ComfyUI pipeline → Flux base generation → SneakerStyle LoRA finetune at 0.7 weight → ControlNet for pose → Runway Gen-3 image-to-video with motion brush → color grade in DaVinci Resolve.",
        node_steps: [
          "Load Flux.1 Dev checkpoint",
          "Apply SneakerStyle_v2 LoRA @ 0.7",
          "ControlNet OpenPose for product framing",
          "KSampler 30 steps, CFG 7.5",
          "Upscale x2 via Topaz",
          "Runway Gen-3 → 5s motion clip"
        ]
      },
      {
        id: 102, title: "Luxury Perfume Still",
        media_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
        aspect_ratio: "1:1",
        base_models: ["Midjourney v6"],
        loras_used: ["GlassRefraction_v3"],
        prompt_string: "luxury perfume bottle on marble, soft morning light, glass refraction, editorial, minimal --ar 1:1 --style raw --v 6",
        workflow_description: "Midjourney v6 with style references → Topaz upscale → Photoshop reflection composite → color grade.",
        node_steps: [
          "Midjourney v6 prompt",
          "Reference image weight 0.6",
          "Topaz Gigapixel 4x",
          "Photoshop reflection pass"
        ]
      }
    ]
  },
  {
    id: 2, name: "Sara Khan", handle: "sara3d",
    avatar_url: "https://i.pravatar.cc/200?img=45",
    bio: "3D motion graphics artist exploring AI + traditional 3D pipelines.",
    rating: 4.7, location: "Bangalore, IN",
    skills: ["3D Rendering", "Motion Design", "Lighting"],
    specialization: ["3D Motion Graphics & Animation"],
    styles: ["3D", "Abstract", "Minimalist"],
    tools: ["ComfyUI", "Midjourney", "Sora"],
    verified_tools: true, verified_workflow: false,
    verified_tools_list: ["ComfyUI", "Midjourney"],
    identity_verified: true,
    portfolio: [
      {
        id: 201, title: "Abstract Glass Motion",
        media_url: "https://images.unsplash.com/photo-1633354931133-27b8b3c1f0f0?w=800&q=80",
        aspect_ratio: "16:9",
        base_models: ["Sora"],
        loras_used: ["GlassMotion_v1"],
        prompt_string: "abstract flowing glass shapes, iridescent, cinematic motion, high-contrast lighting --ar 16:9",
        workflow_description: "Sora base generation → frame interpolation via Topaz → Blender compositing pass.",
        node_steps: ["Sora text-to-video", "Topaz Frame Interpolation 60fps", "Blender compositing"]
      }
    ]
  },
  {
    id: 3, name: "Rohan Verma", handle: "rohanv",
    avatar_url: "https://i.pravatar.cc/200?img=33",
    bio: "Minimalist still image creator for premium brands.",
    rating: 4.5, location: "Delhi, IN",
    skills: ["Still Image", "Brand Design", "Color Theory"],
    specialization: ["Product Photography & Visualization"],
    styles: ["Minimalist", "Editorial"],
    tools: ["Midjourney"],
    verified_tools: false, verified_workflow: false,
    verified_tools_list: [],
    identity_verified: true,
    portfolio: []
  },
  {
    id: 4, name: "Priya Iyer", handle: "priyacreates",
    avatar_url: "https://i.pravatar.cc/200?img=47",
    bio: "Cinematic AI storyteller crafting narratives around brands.",
    rating: 4.8, location: "Chennai, IN",
    skills: ["Storyboarding", "LoRA Training", "Video Editing"],
    specialization: ["Hyper-Realistic Commercials", "Storyboarding & Concept Art"],
    styles: ["Cinematic", "Dramatic", "Film Noir"],
    tools: ["Runway", "ComfyUI"],
    verified_tools: true, verified_workflow: true,
    verified_tools_list: ["Runway", "ComfyUI"],
    identity_verified: true,
    portfolio: []
  },
  {
    id: 5, name: "Kabir Singh", handle: "kabir.studio",
    avatar_url: "https://i.pravatar.cc/200?img=15",
    bio: "Designing quiet, organic brand visuals for wellness brands.",
    rating: 4.6, location: "Goa, IN",
    skills: ["Photography", "Art Direction"],
    specialization: ["Brand Identity & Style Consistency"],
    styles: ["Organic", "Natural Light", "Minimalist"],
    tools: ["Midjourney", "Runway"],
    verified_tools: false, verified_workflow: true,
    verified_tools_list: [],
    identity_verified: false,
    portfolio: []
  },
  {
    id: 6, name: "Ananya Das", handle: "ananya.d",
    avatar_url: "https://i.pravatar.cc/200?img=20",
    bio: "Full-stack AI creative across stills, motion, installations.",
    rating: 4.9, location: "Kolkata, IN",
    skills: ["Creative Direction", "Multi-modal AI", "Motion"],
    specialization: ["Surreal & VFX Filmmaking"],
    styles: ["Surreal", "VFX", "Cyberpunk"],
    tools: ["Midjourney", "Runway", "ComfyUI"],
    verified_tools: true, verified_workflow: true,
    verified_tools_list: ["Midjourney", "Runway", "ComfyUI"],
    identity_verified: true,
    portfolio: []
  }
];

export const mockBrands = [
  { id: 'b_1', name: "Nova Sports", handle: "novasports", avatar_url: "https://i.pravatar.cc/200?img=68", bio: "Bold sportswear for Gen-Z athletes and streetwear enthusiasts.", rating: 4.8, location: "Mumbai, IN", industry: ["Sportswear", "Footwear", "D2C", "Gen-Z Marketing"], campaigns_run: 12, creators_hired: 8, verified: true, past_campaigns: [{ id: 1, title: "Sneaker Launch 2026", media_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80" }, { id: 2, title: "Summer Drop", media_url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80" }, { id: 3, title: "Street Series", media_url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80" }] },
  { id: 'b_2', name: "Sahana Beauty", handle: "sahana", avatar_url: "https://i.pravatar.cc/200?img=44", bio: "Clean, organic skincare for modern rituals.", rating: 4.9, location: "Delhi, IN", industry: ["Beauty", "Skincare", "Wellness"], campaigns_run: 9, creators_hired: 6, verified: true, past_campaigns: [{ id: 1, title: "Serum Launch", media_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" }] },
  { id: 'b_3', name: "Zomato", handle: "zomato", avatar_url: "https://i.pravatar.cc/200?img=52", bio: "Food delivery. Fast, fresh, hungry for new ideas.", rating: 4.7, location: "Gurgaon, IN", industry: ["Food Delivery", "Consumer Tech", "Lifestyle"], campaigns_run: 24, creators_hired: 15, verified: false, past_campaigns: [] },
  { id: 'b_4', name: "A24", handle: "a24films", avatar_url: "https://i.pravatar.cc/200?img=59", bio: "Independent entertainment. Cinematic, bold, weird.", rating: 4.9, location: "New York, US", industry: ["Entertainment", "Film", "Streaming"], campaigns_run: 18, creators_hired: 11, verified: true, past_campaigns: [] },
  { id: 'b_5', name: "Adidas", handle: "adidas", avatar_url: "https://i.pravatar.cc/200?img=64", bio: "Impossible is nothing.", rating: 4.8, location: "Global", industry: ["Sportswear", "Athletics", "Global Brand"], campaigns_run: 42, creators_hired: 28, verified: true, past_campaigns: [] }
];

export const mockMessages = [
  { conversationId: 'conv_1', participants: ['brand_demo', 'u_1'], messages: [
    { id: 'm1', from: 'brand_demo', text: 'Hi Aarav! Loved your sneaker campaign. Available for a 3-week project?', at: '2026-10-08T10:15:00' },
    { id: 'm2', from: 'u_1', text: 'Hey! Yes, capacity starting Monday.', at: '2026-10-08T10:22:00' },
    { id: 'm3', from: 'brand_demo', text: 'Perfect. Sending the brief now.', at: '2026-10-08T10:30:00' }
  ]}
];

export const mockIncomingBriefs = [
  { id: 'b_1', title: 'Futuristic Sneaker Launch', brand: 'Nova Sports', goals: 'Launch a new sneaker line with cyberpunk tone targeting Gen-Z.', content_type: 'Short-Form Video (Reels, TikToks, Shorts)', style: 'Cyberpunk, Neon', aspect_ratio: '9:16 (Vertical – Instagram Reels, TikTok, YouTube Shorts)', license_type: 'Social Media Ads Only', budget: '$4,500', deadline: '2026-10-25', status: 'new' },
  { id: 'b_2', title: 'Organic Skincare Visuals', brand: 'Sahana Beauty', goals: 'Minimalist, natural-light stills for serum launch.', content_type: 'Still Image / Visual (Product shots, key art)', style: 'Minimalist Organic', aspect_ratio: '4:3 (Standard Display / Print)', license_type: 'Global TV Broadcast', budget: '$2,800', deadline: '2026-10-30', status: 'new' }
];

export const demoBrandUser = { id: 'brand_demo', role: 'brand', name: 'Nova Sports', handle: 'novasports', email: 'hello@novasports.com', company: 'Nova Sports', avatar_url: 'https://i.pravatar.cc/200?img=68', bio: 'Bold sportswear for the next generation.', location: 'Mumbai, IN', verified: true };
export const demoCreatorUser = { id: 'u_1', role: 'creator', name: 'Aarav Mehta', handle: 'aarav.ai', email: 'aarav@example.com', avatar_url: 'https://i.pravatar.cc/200?img=12', bio: 'AI filmmaker.', location: 'Mumbai, IN', skills: ['Prompt Engineering', 'Custom LoRA Training'], tools: ['Midjourney', 'Runway', 'ComfyUI'], specialization: ['Hyper-Realistic Commercials'], portfolio: [], verified_tools: true, verified_workflow: true };

export const mockReviews = {
  'creator_1': [
    { id: 'r1', author: 'Nova Sports', authorRole: 'brand', authorAvatar: 'https://i.pravatar.cc/200?img=68', rating: 5, text: 'Incredible work. Delivered in half the time we expected.', at: '2026-09-12', verified: true },
    { id: 'r2', author: 'Sahana Beauty', authorRole: 'brand', authorAvatar: 'https://i.pravatar.cc/200?img=44', rating: 5, text: 'Best AI filmmaker we have worked with.', at: '2026-08-03', verified: false }
  ],
  'creator_2': [
    { id: 'r3', author: 'Adidas', authorRole: 'brand', authorAvatar: 'https://i.pravatar.cc/200?img=64', rating: 5, text: 'Her 3D motion work is on another level.', at: '2026-09-20', verified: true }
  ],
  'brand_b_1': [
    { id: 'r4', author: 'Aarav Mehta', authorRole: 'creator', authorAvatar: 'https://i.pravatar.cc/200?img=12', rating: 5, text: 'Great communication, clear briefs, paid on time.', at: '2026-09-15', verified: true },
    { id: 'r5', author: 'Sara Khan', authorRole: 'creator', authorAvatar: 'https://i.pravatar.cc/200?img=45', rating: 5, text: 'Would work with again.', at: '2026-09-05', verified: false }
  ],
  'brand_b_2': [
    { id: 'r6', author: 'Priya Iyer', authorRole: 'creator', authorAvatar: 'https://i.pravatar.cc/200?img=47', rating: 5, text: 'A dream client.', at: '2026-08-20', verified: true }
  ]
};

export const mockWorkedWith = {
  1: [{ name: 'Nova Sports' }, { name: 'Sahana Beauty' }, { name: 'Coke Studio' }, { name: 'A24' }],
  2: [{ name: 'Adidas' }, { name: 'Spotify' }],
  3: [{ name: 'Aesop' }, { name: 'The Row' }, { name: 'Zomato' }],
  4: [{ name: 'Netflix India' }, { name: 'Prime Video' }],
  5: [{ name: 'Patagonia' }],
  6: [{ name: 'Nike' }, { name: 'Sephora' }]
};

export const mockPastCollaborations = [
  { creatorId: 1, name: 'Aarav Mehta', avatar_url: 'https://i.pravatar.cc/200?img=12', handle: 'aarav.ai', project: 'Futuristic Sneaker Campaign', at: '2026-09-01' },
  { creatorId: 2, name: 'Sara Khan', avatar_url: 'https://i.pravatar.cc/200?img=45', handle: 'sara3d', project: 'Abstract Motion Series', at: '2026-08-15' },
  { creatorId: 4, name: 'Priya Iyer', avatar_url: 'https://i.pravatar.cc/200?img=47', handle: 'priyacreates', project: 'Brand Story Short', at: '2026-07-20' }
];

export const FILTER_OPTIONS = {
  tool_stack: [
    'Midjourney', 'Flux.1', 'Stable Diffusion', 'Adobe Firefly', 'Ideogram', 'Leonardo.Ai',
    'Runway', 'Sora', 'Luma Dream Machine', 'Kling AI', 'Google Veo', 'Pika Labs',
    'ComfyUI', 'AUTOMATIC1111', 'ControlNet', 'Custom LoRA Training',
    'ElevenLabs', 'Suno AI', 'Udio', 'Topaz Video AI'
  ],
  specialization: [
    'Hyper-Realistic Commercials',
    '3D Motion Graphics & Animation',
    'Prompt Engineering & Fine-Tuning',
    'Custom LoRA / Model Training',
    'Storyboarding & Concept Art',
    'Audio-LipSync & Virtual Spokespersons',
    'Product Photography & Visualization',
    'Surreal & VFX Filmmaking',
    'Brand Identity & Style Consistency'
  ],
  content_type: [
    'Short-Form Video (Reels, TikToks, Shorts)',
    'Cinematic Video / Ad',
    'Still Image / Visual',
    '3D Render / Animation',
    'Audio / Voiceover',
    'Interactive / Multi-Modal Asset'
  ],
  format: [
    '9:16 (Vertical – Instagram Reels, TikTok, YouTube Shorts)',
    '16:9 (Horizontal – YouTube, Web, TV Ads)',
    '1:1 (Square – Instagram Feed, LinkedIn)',
    '4:5 (Portrait – Social Feed Posts)',
    '4:3 (Standard Display / Print)',
    '4K Resolution',
    '1080p Full HD'
  ],
  style: [
    'Photorealistic', 'Cyberpunk', 'Minimalist', 'Cinematic', '3D',
    'Abstract', 'Editorial', 'Film Noir', 'Organic', 'Natural Light',
    'Surreal', 'VFX', 'Anime', 'Retro', 'Documentary'
  ]
};

export function isCreatorVerified(creatorId) {
  const reviews = mockReviews[`creator_${creatorId}`] || [];
  return reviews.filter(r => r.verified).length >= 2;
}

export function isBrandVerified(brandId) {
  const reviews = mockReviews[`brand_${brandId}`] || [];
  return reviews.filter(r => r.verified).length >= 2;
}
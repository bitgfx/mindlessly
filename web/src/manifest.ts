
type Category = "Mindfulness" | "Energy" | "Sleep"

export interface Chapter {
    title: string,
    description?: string,
    episodes: { [id: number]: Episode }
    hidden?: boolean
}

export interface Episode {
    title: string,
    description?: string,
    category: Category,
    src: string
    hidden?: boolean
    disabled?: boolean
}

export interface Manifest {
    chapters: { [chapter: string]: Chapter }
}

export const manifest: Manifest = {
    chapters: {
        test: {
            title: "Test Title",
            description: "This is the test description",
            episodes: {
                1: {
                    title: "First test episode",
                    description: "This describes the first test episode",
                    category: "Mindfulness",
                    src: "http://localhost:8080/output/manifest.mpd"
                }
            },
            hidden: true
        },
        brazil: {
            title: "Brazil",
            episodes: {
                1: {
                    title: "The Lagoon",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/brazil/1/manifest.mpd"
                }
            }
        },
        chile: {
            hidden: true,
            title: "Chile",
            episodes: {
                1: {
                    title: "The Pacific Coast",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/chile/1/manifest.mpd"
                }
            }
        },
        iceland: {
            hidden: true,
            title: "Iceland",
            episodes: {
                1: {
                    title: "Black Sands",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/iceland/1/manifest.mpd"
                }
            }
        },
        japan: {
            hidden: true,
            title: "Japan",
            episodes: {
                1: {
                    title: "Green Garden",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/japan/1/manifest.mpd"
                }
            }
        },
        norway: {
            hidden: true,
            title: "Norway",
            episodes: {
                1: {
                    title: "Northern Lights",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/1/manifest.mpd"
                },
                2: {
                    title: "Summer Midnight",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/2/manifest.mpd"
                },
                3: {
                    title: "Mountain Lake",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/3/manifest.mpd"
                },
                4: {
                    title: "Mountain Lake 2",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/4/manifest.mpd"
                },
                5: {
                    title: "Sognefjorden",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/5/manifest.mpd"
                },
                6: {
                    title: "Helgøya",
                    category: "Mindfulness",
                    src: "https://storage.cloud.google.com/mindlessly/norway/6/manifest.mpd"
                }
            }
        }
    }
}
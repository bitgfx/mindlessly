
export interface Chapter {
    title: string,
    description?: string,
    episodes: { [id: number]: Episode }
    hidden?: boolean
}

export interface Episode {
    title: string,
    description?: string,
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
                0: {
                    title: "First test episode",
                    description: "This describes the first test episode",
                    src: "http://localhost:8080/preprocessor/content/dash/output/manifest.mpd"
                }
            },
            hidden: true
        },
        brazil: {
            title: "Brazil",
            episodes: {
                0: {
                    title: "The Lagoon",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/brazil/0/manifest.mpd"
                }
            }
        },
        chile: {
            hidden: true,
            title: "Chile",
            episodes: {
                0: {
                    title: "The Pacific Coast",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/chile/0/manifest.mpd"
                }
            }
        },
        iceland: {
            hidden: true,
            title: "Iceland",
            episodes: {
                0: {
                    title: "Black Sands",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/iceland/0/manifest.mpd"
                }
            }
        },
        japan: {
            hidden: true,
            title: "Japan",
            episodes: {
                0: {
                    title: "Green Garden",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/japan/0/manifest.mpd"
                }
            }
        },
        norway: {
            hidden: true,
            title: "Norway",
            episodes: {
                0: {
                    title: "Northern Lights",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/0/manifest.mpd"
                },
                1: {
                    title: "Summer Midnight",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/1/manifest.mpd"
                },
                2: {
                    title: "Mountain Lake",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/2/manifest.mpd"
                },
                3: {
                    title: "Mountain Lake 2",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/3/manifest.mpd"
                },
                4: {
                    title: "Sognefjorden",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/4/manifest.mpd"
                },
                5: {
                    title: "Helgøya",
                    src: "https://storage.cloud.google.com/mindlessly/chapters/norway/5/manifest.mpd"
                }
            }
        }
    }
}
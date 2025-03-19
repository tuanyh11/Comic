export const generateColorFromName = (name: string) => {
    // List of background colors for avatars
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500',
    ];

    // Generate a number from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use modulo to get a color from the array
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
};

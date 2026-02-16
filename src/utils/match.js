export function checkMatch(userA, userB) {
    // Helper to normalize skills
    const normalize = arr => (arr || []).map(s => s.toLowerCase().trim());

    const aOffers = normalize(userA.skillsOffered);
    const aWants = normalize(userA.skillsWanted);
    const bOffers = normalize(userB.skillsOffered);
    const bWants = normalize(userB.skillsWanted);

    // Check if userA offers what userB wants
    const match1 = aOffers.some(skill => bWants.includes(skill));

    // Check if userB offers what userA wants
    const match2 = bOffers.some(skill => aWants.includes(skill));

    // Return match object or boolean
    // For now returning boolean, but passing strictly mutual match requirement
    return match1 && match2;
}

export function findMatches(currentUser, allUsers) {
    return allUsers.filter(otherUser => {
        if (otherUser.id === currentUser.id) return false;
        return checkMatch(currentUser, otherUser);
    });
}

const createVisitLog = (agentId, propertyId) => {
    return {
        agentId: agentId,
        geoFenceId: propertyId,
        entryTime: new Date(),
        status: 'active'
    };
};

module.exports = { createVisitLog };
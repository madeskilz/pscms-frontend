function getCaps(req) {
  const caps = req.user?.capabilities;
  return Array.isArray(caps) ? caps : [];
}

function requireCapability(cap) {
  return (req, res, next) => {
    const caps = getCaps(req);
    if (caps.includes(cap)) return next();
    return res.status(403).json({ error: 'forbidden' });
  };
}

function requireAnyCapability(capabilities = []) {
  return (req, res, next) => {
    const caps = getCaps(req);
    if (capabilities.some(c => caps.includes(c))) return next();
    return res.status(403).json({ error: 'forbidden' });
  };
}

function requireAllCapabilities(capabilities = []) {
  return (req, res, next) => {
    const caps = getCaps(req);
    if (capabilities.every(c => caps.includes(c))) return next();
    return res.status(403).json({ error: 'forbidden' });
  };
}

module.exports = { requireCapability, requireAnyCapability, requireAllCapabilities };

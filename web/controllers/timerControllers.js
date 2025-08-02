import prisma from '../utils/prisma.js';

const createTimer = async (req, res) => {
  try {
    const shopId = res.locals.shopify.session.shop;
    const { 
      title, 
      productIds, 
      collectionIds, 
      startTime, 
      endTime, 
      duration, 
      style, 
      beforeMessage, 
      afterMessage, 
      loop, 
      hideAfterCompletion, 
      active 
    } = req.body;

    const timer = await prisma.timer.create({
      data: {
        shopId,
        title,
        productIds: productIds || [],
        collectionIds: collectionIds || [],
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        duration,
        style: style || {},
        beforeMessage,
        afterMessage,
        loop: loop ?? false,
        hideAfterCompletion: hideAfterCompletion ?? false,
        active: active ?? true
      },
    });
    res.status(201).json(timer);
  } catch (error) {
    console.error('Error creating timer:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTimers = async (req, res) => {
  try {
    const shopId = res.locals.shopify.session.shop;

    const timers = await prisma.timer.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(timers);
  } catch (error) {
    console.error('Error fetching timers:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = res.locals.shopify.session.shop;

    // Use findFirst instead of findUnique for MongoDB
    const timer = await prisma.timer.findFirst({
      where: { 
        id: id,
        shopId: shopId 
      },
    });

    if (!timer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    res.status(200).json(timer);
  } catch (error) {
    console.error('Error fetching timer:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = res.locals.shopify.session.shop;
    const { 
      title, 
      productIds, 
      collectionIds, 
      startTime, 
      endTime, 
      duration, 
      style, 
      beforeMessage, 
      afterMessage, 
      loop, 
      hideAfterCompletion, 
      active 
    } = req.body;

    // First check if timer exists and belongs to shop
    const existingTimer = await prisma.timer.findFirst({
      where: { 
        id: id,
        shopId: shopId 
      }
    });

    if (!existingTimer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    const timer = await prisma.timer.update({
      where: { id },
      data: {
        title,
        productIds,
        collectionIds,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        duration,
        style,
        beforeMessage,
        afterMessage,
        loop,
        hideAfterCompletion,
        active
      },
    });
    res.status(200).json(timer);
  } catch (error) {
    console.error('Error updating timer:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTimer = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = res.locals.shopify.session.shop;

    // First check if timer exists and belongs to shop
    const existingTimer = await prisma.timer.findFirst({
      where: { 
        id: id,
        shopId: shopId 
      }
    });

    if (!existingTimer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    await prisma.timer.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting timer:', error);
    res.status(500).json({ error: error.message });
  }
};

const toggleTimerActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = res.locals.shopify.session.shop;
    const { active } = req.body;

    // First check if timer exists and belongs to shop
    const existingTimer = await prisma.timer.findFirst({
      where: { 
        id: id,
        shopId: shopId 
      }
    });

    if (!existingTimer) {
      return res.status(404).json({ error: 'Timer not found' });
    }

    const timer = await prisma.timer.update({
      where: { id },
      data: { active },
    });
    res.status(200).json(timer);
  } catch (error) {
    console.error('Error toggling timer status:', error);
    res.status(500).json({ error: error.message });
  }
};

export { createTimer, getTimers, getTimer, updateTimer, deleteTimer, toggleTimerActiveStatus };
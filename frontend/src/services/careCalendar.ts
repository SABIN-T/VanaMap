// Plant Care Calendar - Personalized Reminders System
import { useState, useEffect } from 'react';

export interface PlantReminder {
    id: string;
    plantName: string;
    plantId?: string;
    type: 'water' | 'fertilize' | 'prune' | 'repot' | 'mist' | 'rotate';
    frequency: number; // days
    lastDone: Date;
    nextDue: Date;
    notes?: string;
    enabled: boolean;
}

export interface CareCalendarData {
    reminders: PlantReminder[];
    notifications: boolean;
}

export class CareCalendarService {
    private static STORAGE_KEY = 'plant_care_calendar';

    // Get all reminders
    static getReminders(): PlantReminder[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return [];

        const parsed = JSON.parse(data);
        return parsed.reminders.map((r: any) => ({
            ...r,
            lastDone: new Date(r.lastDone),
            nextDue: new Date(r.nextDue)
        }));
    }

    // Add new reminder
    static addReminder(reminder: Omit<PlantReminder, 'id' | 'nextDue'>): PlantReminder {
        const reminders = this.getReminders();

        const newReminder: PlantReminder = {
            ...reminder,
            id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            nextDue: this.calculateNextDue(reminder.lastDone, reminder.frequency)
        };

        reminders.push(newReminder);
        this.saveReminders(reminders);

        return newReminder;
    }

    // Mark reminder as done
    static markAsDone(reminderId: string): void {
        const reminders = this.getReminders();
        const reminder = reminders.find(r => r.id === reminderId);

        if (reminder) {
            const now = new Date();
            reminder.lastDone = now;
            reminder.nextDue = this.calculateNextDue(now, reminder.frequency);
            this.saveReminders(reminders);
        }
    }

    // Get today's tasks
    static getTodaysTasks(): PlantReminder[] {
        const reminders = this.getReminders();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return reminders.filter(r => {
            const dueDate = new Date(r.nextDue);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate <= today && r.enabled;
        });
    }

    // Get upcoming tasks (next 7 days)
    static getUpcomingTasks(): PlantReminder[] {
        const reminders = this.getReminders();
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        return reminders.filter(r => {
            const dueDate = new Date(r.nextDue);
            return dueDate > today && dueDate <= nextWeek && r.enabled;
        }).sort((a, b) => a.nextDue.getTime() - b.nextDue.getTime());
    }

    // Delete reminder
    static deleteReminder(reminderId: string): void {
        const reminders = this.getReminders().filter(r => r.id !== reminderId);
        this.saveReminders(reminders);
    }

    // Update reminder
    static updateReminder(reminderId: string, updates: Partial<PlantReminder>): void {
        const reminders = this.getReminders();
        const index = reminders.findIndex(r => r.id === reminderId);

        if (index !== -1) {
            reminders[index] = { ...reminders[index], ...updates };
            if (updates.frequency || updates.lastDone) {
                reminders[index].nextDue = this.calculateNextDue(
                    reminders[index].lastDone,
                    reminders[index].frequency
                );
            }
            this.saveReminders(reminders);
        }
    }

    // Calculate next due date
    private static calculateNextDue(lastDone: Date, frequencyDays: number): Date {
        const next = new Date(lastDone);
        next.setDate(next.getDate() + frequencyDays);
        return next;
    }

    // Save reminders to storage
    private static saveReminders(reminders: PlantReminder[]): void {
        const data: CareCalendarData = {
            reminders,
            notifications: true
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    // Request notification permission
    static async requestNotificationPermission(): Promise<boolean> {
        if (!('Notification' in window)) {
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    // Send notification
    static sendNotification(title: string, body: string, icon?: string): void {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: icon || '/plant-icon.png',
                badge: '/plant-badge.png',
                tag: 'plant-care',
                requireInteraction: false
            });
        }
    }

    // Check and send due reminders
    static checkDueReminders(): void {
        const today = this.getTodaysTasks();

        if (today.length > 0) {
            const taskList = today.map(t => `${t.plantName}: ${t.type}`).join(', ');
            this.sendNotification(
                '🌱 Plant Care Reminder',
                `You have ${today.length} task(s) today: ${taskList}`
            );
        }
    }

    // Get care type icon
    static getCareIcon(type: PlantReminder['type']): string {
        const icons = {
            water: '💧',
            fertilize: '🌱',
            prune: '✂️',
            repot: '🪴',
            mist: '💨',
            rotate: '🔄'
        };
        return icons[type];
    }

    // Get care type label
    static getCareLabel(type: PlantReminder['type']): string {
        const labels = {
            water: 'Watering',
            fertilize: 'Fertilizing',
            prune: 'Pruning',
            repot: 'Repotting',
            mist: 'Misting',
            rotate: 'Rotating'
        };
        return labels[type];
    }

    // Format days until due
    static getDaysUntilDue(dueDate: Date): string {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        return `Due in ${diffDays} days`;
    }
}

// React Hook for Care Calendar
export function useCareCalendar() {
    const [reminders, setReminders] = useState<PlantReminder[]>([]);
    const [todaysTasks, setTodaysTasks] = useState<PlantReminder[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<PlantReminder[]>([]);

    const loadReminders = () => {
        setReminders(CareCalendarService.getReminders());
        setTodaysTasks(CareCalendarService.getTodaysTasks());
        setUpcomingTasks(CareCalendarService.getUpcomingTasks());
    };

    useEffect(() => {
        loadReminders();

        // Check for due reminders every hour
        const interval = setInterval(() => {
            CareCalendarService.checkDueReminders();
            loadReminders();
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const addReminder = (reminder: Omit<PlantReminder, 'id' | 'nextDue'>) => {
        CareCalendarService.addReminder(reminder);
        loadReminders();
    };

    const markAsDone = (reminderId: string) => {
        CareCalendarService.markAsDone(reminderId);
        loadReminders();
    };

    const deleteReminder = (reminderId: string) => {
        CareCalendarService.deleteReminder(reminderId);
        loadReminders();
    };

    const updateReminder = (reminderId: string, updates: Partial<PlantReminder>) => {
        CareCalendarService.updateReminder(reminderId, updates);
        loadReminders();
    };

    return {
        reminders,
        todaysTasks,
        upcomingTasks,
        addReminder,
        markAsDone,
        deleteReminder,
        updateReminder,
        refresh: loadReminders
    };
}

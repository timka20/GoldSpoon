import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Utensils,
  Users,
  Trash2,
  Droplets,
  Plus,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cleanerApi, type CleaningTask, type CleaningZone, type CleaningScheduleItem, type User } from '../../services/api';

interface CleanerPanelProps {
  user: User;
}

export function CleanerPanel({ user }: CleanerPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [zones, setZones] = useState<CleaningZone[]>([]);
  const [schedule, setSchedule] = useState<CleaningScheduleItem[]>([]);


  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [tasksData, zonesData, scheduleData] = await Promise.all([
        cleanerApi.getTasks().catch(() => []),
        cleanerApi.getZones().catch(() => []),
        cleanerApi.getSchedule().catch(() => []),
      ]);
      setTasks(tasksData || []);
      setZones(zonesData || []);
      setSchedule(scheduleData || []);
    } catch (error: any) {
      toast.error('Ошибка загрузки: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsLoading(false);
    }
  };

  const parseChecklist = (task: CleaningTask) => {
    if (!task.Checklist) return [];
    if (Array.isArray(task.Checklist)) return task.Checklist;
    try {
      return JSON.parse(task.Checklist);
    } catch {
      return [];
    }
  };

  const updateTaskStatus = async (taskId: number, status: string) => {
    try {
      const data: any = { status };
      if (status === 'completed') data.completedAt = new Date().toISOString();
      await cleanerApi.updateTask(taskId, data);
      toast.success('Статус задачи обновлен');
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const updateChecklist = async (taskId: number, checklist: any[]) => {
    try {
      await cleanerApi.updateTask(taskId, { checklist });
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const handleGenerateTasks = async () => {
    try {
      await cleanerApi.generateTasks();
      toast.success('Сгенерированы 3 новые задачи');
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!confirm('Удалить задачу?')) return;
    try {
      await cleanerApi.deleteTask(taskId);
      toast.success('Задача удалена');
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const markZoneClean = async (zone: CleaningZone) => {
    try {
      await cleanerApi.updateZone(zone.ZoneID, {
        status: 'clean',
        lastCleaned: new Date().toISOString(),
      });
      toast.success('Зона отмечена как чистая');
      loadAll();
    } catch (error: any) {
      toast.error('Ошибка: ' + error.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'in-progress':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'in-progress':
        return 'Выполняется';
      case 'completed':
        return 'Завершено';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-orange-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getAreaStatusColor = (status: string) => {
    switch (status) {
      case 'clean':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-attention':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dirty':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAreaStatusText = (status: string) => {
    switch (status) {
      case 'clean':
        return 'Чисто';
      case 'needs-attention':
        return 'Требует внимания';
      case 'dirty':
        return 'Грязно';
      default:
        return status;
    }
  };

  const getAreaIcon = (areaName: string) => {
    switch (areaName) {
      case 'Обеденный зал':
        return <Utensils className="w-5 h-5" />;
      case 'Кухня':
        return <Utensils className="w-5 h-5" />;
      case 'Туалеты':
        return <Droplets className="w-5 h-5" />;
      case 'Вход/Ресепшен':
        return <Users className="w-5 h-5" />;
      case 'Кладовая':
        return <Trash2 className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const pendingTasks = tasks.filter((t) => t.Status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.Status === 'in-progress');
  const completedTasks = tasks.filter((t) => t.Status === 'completed');
  const dirtyTablesCount = tasks.filter((t) => t.Status !== 'completed' && t.TableID).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель уборщика</h1>
          <p className="text-gray-600">Управление задачами по уборке</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAll} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button onClick={handleGenerateTasks} disabled={isLoading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Запросить задачи
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ожидают</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Выполняется</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Столов на уборку</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dirtyTablesCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="areas">Зоны</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ожидают выполнения */}
            <div>
              <h3 className="font-medium mb-3 text-orange-600">Ожидают выполнения</h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task.TaskID} className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{task.Title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.Priority)}`}></div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{task.Area}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{task.Description}</p>
                      {task.TableID && (
                        <Badge variant="outline">Стол #{task.TableID}</Badge>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Время выполнения:</span>
                        <span className="font-medium">{task.EstimatedTime} мин</span>
                      </div>
                      <Button
                        onClick={() => updateTaskStatus(task.TaskID, 'in-progress')}
                        className="w-full"
                        size="sm"
                      >
                        Начать выполнение
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {pendingTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет ожидающих задач</p>
                )}
              </div>
            </div>

            {/* Выполняются */}
            <div>
              <h3 className="font-medium mb-3 text-blue-600">Выполняются</h3>
              <div className="space-y-3">
                {inProgressTasks.map((task) => {
                  const checklist = parseChecklist(task);
                  return (
                    <Card key={task.TaskID} className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{task.Title}</CardTitle>
                          <Badge variant="secondary">В работе</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{task.Area}</div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {checklist.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Чек-лист:</h5>
                            <div className="space-y-2">
                              {checklist.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={(checked) => {
                                      const newList = [...checklist];
                                      newList[idx] = { ...item, completed: checked as boolean };
                                      updateChecklist(task.TaskID, newList);
                                    }}
                                  />
                                  <span
                                    className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                                  >
                                    {item.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => updateTaskStatus(task.TaskID, 'completed')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            size="sm"
                            disabled={checklist.length > 0 && !checklist.every((i: any) => i.completed)}
                          >
                            Завершить
                          </Button>
                          <Button
                            onClick={() => updateTaskStatus(task.TaskID, 'pending')}
                            variant="outline"
                            size="sm"
                          >
                            Пауза
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {inProgressTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет выполняемых задач</p>
                )}
              </div>
            </div>

            {/* Завершено */}
            <div>
              <h3 className="font-medium mb-3 text-green-600">Завершено</h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.TaskID} className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{task.Title}</CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-sm text-muted-foreground">{task.Area}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">{task.Description}</p>
                        <div className="text-center">
                          <Badge variant="default" className="bg-green-600">
                            Задача завершена
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={() => deleteTask(task.TaskID)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {completedTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Нет завершенных задач</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Состояние зон</CardTitle>
              <CardDescription>Обзор чистоты всех зон ресторана</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => {
                  const zoneTasks = tasks.filter(
                    (t) => t.Area === zone.Name && t.Status !== 'completed'
                  ).length;
                  return (
                    <Card key={zone.ZoneID} className={`border-2 ${getAreaStatusColor(zone.Status)}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getAreaIcon(zone.Name)}
                            <CardTitle className="text-lg">{zone.Name}</CardTitle>
                          </div>
                          <Badge variant="outline" className={getAreaStatusColor(zone.Status)}>
                            {getAreaStatusText(zone.Status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Последняя уборка:</span>
                          <span className="font-medium">
                            {zone.LastCleaned
                              ? new Date(zone.LastCleaned).toLocaleString('ru-RU', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Активных задач:</span>
                          <span className="font-medium">{zoneTasks}</span>
                        </div>

                        {zone.Status !== 'clean' && (
                          <Button size="sm" className="w-full" onClick={() => markZoneClean(zone)}>
                            Отметить как чистую
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {zones.length === 0 && (
                  <p className="text-center text-muted-foreground py-4 col-span-full">Нет данных о зонах</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Регулярные задачи</CardTitle>
                <CardDescription>Автоматическое создание задач по расписанию</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedule.map((item) => (
                  <div
                    key={item.ScheduleID}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                      <span className="font-medium text-sm">{item.TaskName}</span>
                      <span className="text-sm text-muted-foreground">{item.Area}</span>
                      <Badge variant="outline">{item.IntervalMinutes} мин</Badge>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.Priority)}`} />
                      <Badge variant={item.IsActive ? 'default' : 'secondary'}>
                        {item.IsActive ? 'Активно' : 'Выключено'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {schedule.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Нет задач в расписании
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статус автоматизации</CardTitle>
                <CardDescription>Информация о работе системы уборки</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Авто-задачи со столов</span>
                    <Badge variant="default" className="bg-green-600">
                      Активно
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Периодические задачи</span>
                    <Badge variant="default" className="bg-green-600">
                      Активно
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Всего задач в системе</span>
                    <span className="font-medium">{tasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Зон на контроле</span>
                    <span className="font-medium">{zones.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

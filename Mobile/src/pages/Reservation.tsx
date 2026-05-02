import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Users, Trash2, AlertCircle } from 'lucide-react';
import { MdTableBar } from 'react-icons/md';
import { useAuthStore } from '../store/authStore';
import { useReservationStore } from '../store/reservationStore';
import { useOrderStore } from '../store/orderStore';

export default function Reservation() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { tables, reservations, fetchTables, fetchReservations, createReservation, deleteReservation, isLoading } = useReservationStore();
  const { fetchOrders, activeTableIds } = useOrderStore();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(2);
  const [peopleInput, setPeopleInput] = useState('2');
  const [activeTab, setActiveTab] = useState<'new' | 'my'>('new');

  useEffect(() => {
    fetchTables();
    fetchOrders();
    if (isAuthenticated) fetchReservations();
  }, [fetchTables, fetchReservations, fetchOrders, isAuthenticated]);

  const handleSubmit = async () => {
    if (!selectedTable || !date || !time) return;
    const dateTime = new Date(`${date}T${time}`).toISOString();
    await createReservation({
      tableId: selectedTable,
      reservationDateTime: dateTime,
      numberOfPeople: people,
    });
    setSelectedTable(null);
    setActiveTab('my');
  };

  const myReservations = reservations.filter((r) => r.UserID === user?.UserID);

  const reservedTableIds = new Set(reservations.map((r) => r.TableID));

  const maxCapacity = people + 3;

  const availableTables = tables.filter((t) =>
    !t.IsReserved &&
    !activeTableIds.includes(t.TableID) &&
    !reservedTableIds.has(t.TableID) &&
    t.Capacity >= people &&
    t.Capacity <= maxCapacity
  );

  const hiddenLargeTables = tables.filter((t) =>
    !t.IsReserved &&
    !activeTableIds.includes(t.TableID) &&
    !reservedTableIds.has(t.TableID) &&
    t.Capacity > maxCapacity
  );

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4  sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gold-gradient">Бронирование</h1>
      </div>

      {!isAuthenticated ? (
        <div className="px-5 mt-10 text-center">
          <AlertCircle size={48} className="text-charcoal-surface mx-auto mb-3" />
          <p className="text-muted text-sm mb-4">Войдите, чтобы бронировать столы</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gold-gradient text-charcoal font-bold px-8 py-3 rounded-xl"
          >
            Войти
          </button>
        </div>
      ) : (
        <>
          {}
          <div className="px-5 mt-3 flex gap-2">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'new' ? 'bg-gold text-charcoal' : 'glass text-muted'
              }`}
            >
              Новая бронь
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'my' ? 'bg-gold text-charcoal' : 'glass text-muted'
              }`}
            >
              Мои брони ({myReservations.length})
            </button>
          </div>

          {activeTab === 'new' ? (
            <div className="px-5 mt-4 space-y-4">
              {}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-platinum mb-1.5">Дата</label>
                  <div className="relative">
                    <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-platinum mb-1.5">Время</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs text-platinum mb-1.5">Гостей</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={peopleInput}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setPeopleInput(raw);
                      if (raw) {
                        const val = Number(raw);
                        if (val >= 1 && val <= 20) {
                          setPeople(val);
                          const selected = tables.find((t) => t.TableID === selectedTable);
                          if (selected && selected.Capacity < val) {
                            setSelectedTable(null);
                          }
                        }
                      }
                    }}
                    onBlur={() => {
                      let val = Number(peopleInput);
                      if (!val || val < 1) val = 1;
                      if (val > 20) val = 20;
                      setPeople(val);
                      setPeopleInput(String(val));
                      const selected = tables.find((t) => t.TableID === selectedTable);
                      if (selected && selected.Capacity < val) {
                        setSelectedTable(null);
                      }
                    }}
                    className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs text-platinum mb-1.5">Выберите стол</label>
                {availableTables.length === 0 ? (
                  <div className="glass rounded-xl p-6 text-center">
                    <MdTableBar size={32} className="text-muted mx-auto mb-2" />
                    <p className="text-sm text-platinum font-medium">Сейчас нет свободных столов</p>
                    <p className="text-xs text-muted mt-1">Попробуйте позже</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableTables.map((table) => (
                      <button
                        key={table.TableID}
                        onClick={() => setSelectedTable(table.TableID)}
                        className={`p-4 rounded-xl text-left transition-colors ${
                          selectedTable === table.TableID
                            ? 'bg-gold/20 border border-gold'
                            : 'glass rounded-xl active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MdTableBar size={16} className={selectedTable === table.TableID ? 'text-gold' : 'text-muted'} />
                          <span className="text-sm font-semibold">Стол {table.TableNumber}</span>
                        </div>
                        <p className="text-xs text-muted">{table.Capacity} мест</p>
                      </button>
                    ))}
                  </div>
                )}
                {hiddenLargeTables.length > 0 && (
                  <p className="text-xs text-muted text-center mt-3">
                    Свободные столы на {maxCapacity + 1} и более персон скрыты, так как у вас будет {people}{' '}
                    {people === 1 ? 'гость' : people < 5 ? 'гостя' : 'гостей'}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedTable || !date || !time || isLoading}
                className="w-full bg-gold-gradient text-charcoal font-bold py-3.5 rounded-xl disabled:opacity-60 active:scale-[0.98] transition-transform"
              >
                {isLoading ? 'Бронирование...' : 'Забронировать'}
              </button>
            </div>
          ) : (
            <div className="px-5 mt-4 space-y-3">
              {myReservations.length === 0 && (
                <p className="text-muted text-sm text-center py-6">У вас нет бронирований</p>
              )}
              {myReservations.map((res) => (
                <div key={res.ReservationID} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Стол {res.TableNumber}</p>
                    <button
                      onClick={() => deleteReservation(res.ReservationID)}
                      className="text-muted active:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(res.ReservationDateTime).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{res.NumberOfPeople} гостей</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}


"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlarmClock, Plus, Trash2 } from "lucide-react"
import type { Alarm, Country } from "../types"

interface AlarmManagerProps {
  countries: Country[]
  alarms: Alarm[]
  onAlarmsChange: (alarms: Alarm[]) => void
}

export function AlarmManager({ countries, alarms, onAlarmsChange }: AlarmManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAlarm, setNewAlarm] = useState({
    time: "09:00",
    timezone: countries[0].timezone,
    label: "",
    days: [] as string[],
  })

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarm.time,
      timezone: newAlarm.timezone,
      label: newAlarm.label || "Alarm",
      enabled: true,
      days: newAlarm.days.length > 0 ? newAlarm.days : ["daily"],
    }

    onAlarmsChange([...alarms, alarm])
    setNewAlarm({ time: "09:00", timezone: countries[0].timezone, label: "", days: [] })
    setShowAddForm(false)
  }

  const toggleAlarm = (id: string) => {
    onAlarmsChange(alarms.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    onAlarmsChange(alarms.filter((alarm) => alarm.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlarmClock className="w-5 h-5" />
            Alarms ({alarms.length})
          </div>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-black text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Alarm
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="p-4 border rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newAlarm.time}
                  onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
                />
              </div>
              <div>
                <Label>Timezone</Label>
                <Select
                  value={newAlarm.timezone}
                  onValueChange={(value) => setNewAlarm({ ...newAlarm, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.timezone}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Label</Label>
              <Input
                placeholder="Alarm label"
                value={newAlarm.label}
                onChange={(e) => setNewAlarm({ ...newAlarm, label: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addAlarm} size="sm" className="bg-black text-white">
                Add Alarm
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {alarms.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No alarms set</p>
          ) : (
            alarms.map((alarm) => (
              <div key={alarm.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch checked={alarm.enabled} onCheckedChange={() => toggleAlarm(alarm.id)} />
                  <div>
                    <div className="font-mono font-semibold">{alarm.time}</div>
                    <div className="text-sm text-gray-500">{alarm.label}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {countries.find((c) => c.timezone === alarm.timezone)?.flag}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAlarm(alarm.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

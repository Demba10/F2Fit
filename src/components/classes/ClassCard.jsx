import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, User, Trash2, Edit, MoreVertical, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function ClassCard({ classItem, onDelete, onEdit }) {
    const isFull = classItem.participants >= classItem.maxParticipants;

  return (
    <motion.div 
        className="bg-secondary rounded-2xl shadow-lg border border-border/50 p-5 flex flex-col h-full hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
        whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground">{classItem.name}</h3>
          <p className="text-sm text-primary font-medium">{classItem.type}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:bg-background">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-secondary border-border/50">
            <DropdownMenuItem onClick={() => onEdit(classItem)} className="gap-2 cursor-pointer focus:bg-background"><Edit className="w-4 h-4" /> Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(classItem.id)} className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground flex-grow">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{new Date(classItem.date).toLocaleDateString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'})}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{classItem.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span>Coach: <span className="text-foreground font-medium">{classItem.coachName}</span></span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Participants</span>
            <span className={`text-sm font-bold ${isFull ? 'text-red-500' : 'text-foreground'}`}>{classItem.participants} / {classItem.maxParticipants}</span>
        </div>
        <div className="w-full bg-background rounded-full h-2.5">
          <motion.div 
            className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
            style={{ width: `${(classItem.participants / classItem.maxParticipants) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(classItem.participants / classItem.maxParticipants) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {isFull && 
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-red-500 font-semibold">
                <CheckCircle className="w-4 h-4"/>
                <span>Complet</span>
            </div>
        }
      </div>

    </motion.div>
  );
}

export default ClassCard;
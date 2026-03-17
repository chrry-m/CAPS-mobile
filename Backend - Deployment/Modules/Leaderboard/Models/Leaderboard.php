<?php
namespace Modules\Leaderboard\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Subjects\Models\Subject;
use Modules\Users\Models\User;
/**
 * Leaderboard Model
 * 
 * Represents a student's best performance record in the CAPS leaderboard system.
 * Ranking is based purely on the highest percentage ever achieved (High Score model).
 * 
 * Business Rules:
 * - A student's rank is based on their highest percentage ever achieved in an exam attempt.
 * - If a new attempt is higher than the current record, update the leaderboard.
 * - If it is lower, the record remains unchanged.
 */
class Leaderboard extends Model
{
    use HasFactory;
    protected $table = 'leaderboards';
    protected $primaryKey = 'leaderboardID';
    public $timestamps = true;
    protected $fillable = [
        'userID',
        'subjectID',
        'highest_percentage',
        'total_exams',
        'score',
    ];
    protected $casts = [
        'highest_percentage' => 'float',
        'total_exams' => 'integer',
        'score' => 'float',
    ];
    /**
     * Relationship: A leaderboard record belongs to a subject.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subjectID', 'subjectID');
    }
    /**
     * Relationship: A leaderboard record belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }
    /**
     * Update or create a leaderboard record when a student submits an exam.
     */
    public static function updateOrCreateRecord(int $userID, int $subjectID, float $percentage): self
    {
        $record = self::where('userID', $userID)
            ->where('subjectID', $subjectID)
            ->first();
        if (!$record) {
            $record = new self();
            $record->userID = $userID;
            $record->subjectID = $subjectID;
            $record->total_exams = 0;
            $record->highest_percentage = 0;
            $record->score = 0;
        }
        if ($percentage > $record->highest_percentage) {
            $record->highest_percentage = $percentage;
        }
        $record->total_exams += 1;
        $record->score = $record->highest_percentage;
        $record->save();
        return $record;
    }
    /**
     * Recalculate all scores.
     */
    public static function recalculateAllScores(): void
    {
        $records = self::all();
        foreach ($records as $record) {
            $record->score = $record->highest_percentage;
            $record->save();
        }
    }
    /**
     * Get top records by score.
     */
    public static function getTopRecords(int $limit = 10, ?int $subjectID = null, ?int $programID = null)
    {
        $query = self::with(['user.program', 'user.role']);
        if ($subjectID) {
            $query->where('subjectID', $subjectID);
        }
        if ($programID) {
            $query->whereHas('user', function ($q) use ($programID) {
                $q->where('programID', $programID);
            });
        }
        return $query->orderByDesc('score')
            ->limit($limit)
            ->get();
    }
}
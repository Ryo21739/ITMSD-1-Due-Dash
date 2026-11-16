import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AssignmentCard } from '@/components/cards/AssignmentCard';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AppScreen } from '@/components/layout/AppScreen';
import { OptionSheet } from '@/components/forms/OptionSheet';
import { colors } from '@/constants/colors';
import { fonts, type } from '@/constants/typography';
import { useAppData } from '@/hooks/use-app-data';
import { isThisWeek } from '@/lib/dates';
import {
  completedSorted,
  courseFor,
  courseLabel,
  openOnly,
  sortByDue,
} from '@/lib/selectors';

type Direction = 'asc' | 'desc';

export default function AssignmentsScreen() {
  const { data, toggleCompleted } = useAppData();
  const params = useLocalSearchParams<{ course?: string }>();
  const courseParam = Array.isArray(params.course) ? params.course[0] : params.course;

  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string | null>(courseParam ?? null);
  const [direction, setDirection] = useState<Direction>('asc');
  const [weekOnly, setWeekOnly] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const now = new Date();
  const open = openOnly(data.assignments);
  const completed = completedSorted(data.assignments);

  const search = query.trim().toLowerCase();
  let filtered = open.filter((assignment) => {
    if (courseFilter && assignment.courseId !== courseFilter) return false;
    if (weekOnly && !isThisWeek(new Date(assignment.dueAt), now)) return false;
    if (!search) return true;
    const course = courseFor(data.courses, assignment.courseId);
    return (
      assignment.title.toLowerCase().includes(search) ||
      courseLabel(course).toLowerCase().includes(search)
    );
  });

  filtered = sortByDue(filtered);
  if (direction === 'desc') filtered = filtered.reverse();

  const searching = search.length > 0;
  const visible = searching || showAll ? filtered : filtered.slice(0, 4);
  const hidden = Math.max(0, filtered.length - 4);

  const selectedCourse = courseFilter
    ? courseFor(data.courses, courseFilter)
    : undefined;
  const courseBadge = selectedCourse ? selectedCourse.code : 'All courses';

  const completedPreview = completed.slice(0, 1);

  return (
    <AppScreen
      title="Assignments"
      subtitle={`${open.length} upcoming · ${completed.length} completed`}
      rightIcon={Plus}
      rightLabel="Add assignment"
      onRightPress={() => router.push('/assignment/new')}
      active="tasks"
      topPadding={24}
      gap={16}>
      <View style={styles.search}>
        <Search size={17} color={colors.muted} strokeWidth={1.5} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search assignments or courses"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filters}>
        <Badge
          label={courseBadge}
          active={Boolean(courseFilter)}
          onPress={() => setCourseOpen(true)}
        />
        <Badge
          label={direction === 'asc' ? 'By due date ↓' : 'By due date ↑'}
          onPress={() => setDirection((value) => (value === 'asc' ? 'desc' : 'asc'))}
        />
        <Badge
          label="This week"
          active={weekOnly}
          onPress={() => setWeekOnly((value) => !value)}
        />
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Upcoming"
          trailing={`${filtered.length} assignment${filtered.length === 1 ? '' : 's'}`}
        />
        {filtered.length === 0 ? (
          <EmptyState message="No assignments match your filters." />
        ) : (
          visible.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={courseFor(data.courses, assignment.courseId)}
              onPress={() => router.push(`/assignment/${assignment.id}`)}
              onToggleComplete={() => toggleCompleted(assignment.id)}
            />
          ))
        )}

        {!searching && filtered.length > 4 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowAll((value) => !value)}
            hitSlop={8}
            style={styles.more}>
            <Text style={[type.label12, styles.moreLabel]}>
              {showAll
                ? 'Show fewer upcoming assignments'
                : `Show ${hidden} more upcoming assignment${hidden === 1 ? '' : 's'}`}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.section}>
        <SectionHeading
          title="Completed"
          trailing="View all"
          onTrailingPress={() => router.push('/progress')}
        />
        {completedPreview.length === 0 ? (
          <EmptyState message="Completed assignments will show up here." />
        ) : (
          completedPreview.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={courseFor(data.courses, assignment.courseId)}
              onPress={() => router.push(`/assignment/${assignment.id}`)}
              onToggleComplete={() => toggleCompleted(assignment.id)}
            />
          ))
        )}
      </View>

      <OptionSheet
        visible={courseOpen}
        title="Filter by course"
        options={[
          { id: 'all', label: 'All courses' },
          ...data.courses.map((course) => ({
            id: course.id,
            label: `${course.code} - ${course.name}`,
          })),
        ]}
        selectedId={courseFilter ?? 'all'}
        onSelect={(id) => setCourseFilter(id === 'all' ? null : id)}
        onClose={() => setCourseOpen(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    paddingHorizontal: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.ink,
    includeFontPadding: false,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 10,
  },
  more: {
    alignSelf: 'stretch',
    paddingVertical: 2,
  },
  moreLabel: {
    color: colors.primary,
    textAlign: 'center',
  },
});
